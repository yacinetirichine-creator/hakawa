"""
Export service - PDF/EPUB generation
"""

from __future__ import annotations

import os
import re
import html
from datetime import datetime

from app.config import settings
from app.utils.supabase import supabase

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.units import cm

from ebooklib import epub


class ExportService:
    """Service for generating exports"""

    def _ensure_dir(self, path: str) -> None:
        os.makedirs(path, exist_ok=True)

    def _safe_filename(self, name: str) -> str:
        name = (name or "export").strip().lower()
        name = re.sub(r"[^a-z0-9\-_]+", "-", name)
        name = re.sub(r"-+", "-", name).strip("-")
        return name or "export"

    def _get_project_data(self, project_id: str) -> tuple[dict, list[dict]]:
        project = supabase.table("projects").select("*").eq("id", project_id).execute()
        if not project.data:
            raise ValueError("Project not found")

        chapters = (
            supabase.table("chapters")
            .select("*")
            .eq("project_id", project_id)
            .order("number")
            .execute()
        )

        return project.data[0], chapters.data or []

    async def generate_pdf(self, project_id: str) -> str:
        """
        Generate PDF for a project
        Returns: URL to generated file
        """
        project, chapters = self._get_project_data(project_id)

        base_dir = settings.exports_local_dir
        self._ensure_dir(base_dir)

        title = project.get("title") or "Sans titre"
        stamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"{self._safe_filename(title)}_{stamp}.pdf"
        file_path = os.path.join(base_dir, filename)

        styles = getSampleStyleSheet()
        story = []
        story.append(Paragraph(title, styles["Title"]))
        pitch = project.get("pitch")
        if pitch:
            story.append(Spacer(1, 0.5 * cm))
            story.append(Paragraph(pitch, styles["BodyText"]))
        story.append(PageBreak())

        for ch in chapters:
            ch_title = ch.get("title") or f"Chapitre {ch.get('number', '')}".strip()
            story.append(Paragraph(ch_title, styles["Heading1"]))
            content = (ch.get("content") or "").strip()
            if not content:
                content = "(Chapitre vide)"
            for para in content.split("\n\n"):
                story.append(Paragraph(para.replace("\n", "<br/>"), styles["BodyText"]))
                story.append(Spacer(1, 0.4 * cm))
            story.append(PageBreak())

        doc = SimpleDocTemplate(
            file_path,
            pagesize=A4,
            leftMargin=2 * cm,
            rightMargin=2 * cm,
            topMargin=2 * cm,
            bottomMargin=2 * cm,
        )
        doc.build(story)

        return file_path

    async def generate_epub(self, project_id: str) -> str:
        """
        Generate EPUB for a project
        Returns: URL to generated file
        """
        project, chapters = self._get_project_data(project_id)

        base_dir = settings.exports_local_dir
        self._ensure_dir(base_dir)

        title = project.get("title") or "Sans titre"
        stamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"{self._safe_filename(title)}_{stamp}.epub"
        file_path = os.path.join(base_dir, filename)

        book = epub.EpubBook()
        book.set_identifier(project_id)
        book.set_title(title)
        author = project.get("author") or project.get("author_name") or "Hakawa"
        book.add_author(author)

        # Basic style
        style = "body{font-family: serif;} h1{margin-top:1em;}"
        nav_css = epub.EpubItem(
            uid="style_nav",
            file_name="style/nav.css",
            media_type="text/css",
            content=style,
        )
        book.add_item(nav_css)

        spine = ["nav"]
        toc = []

        if project.get("pitch"):
            intro = epub.EpubHtml(
                title="Introduction", file_name="intro.xhtml", lang="fr"
            )
            intro.content = f"<h1>{title}</h1><p>{project.get('pitch')}</p>"
            book.add_item(intro)
            toc.append(intro)
            spine.append(intro)

        for ch in chapters:
            number = ch.get("number")
            ch_title = (
                ch.get("title") or f"Chapitre {number}"
                if number is not None
                else "Chapitre"
            )
            file_name = f"chap_{number or 'x'}.xhtml"
            chapter = epub.EpubHtml(title=ch_title, file_name=file_name, lang="fr")
            content = (ch.get("content") or "").strip()
            content_html = "".join(
                "<p>" + html.escape(p).replace("\n", "<br/>") + "</p>"
                for p in content.split("\n\n")
                if p.strip()
            )
            if not content_html:
                content_html = "<p>(Chapitre vide)</p>"
            chapter.content = f"<h1>{ch_title}</h1>{content_html}"
            book.add_item(chapter)
            toc.append(chapter)
            spine.append(chapter)

        book.toc = tuple(toc)
        book.add_item(epub.EpubNcx())
        book.add_item(epub.EpubNav())
        book.spine = spine

        epub.write_epub(file_path, book, {})
        return file_path

    async def generate_kdp_package(self, project_id: str) -> dict:
        """
        Generate complete KDP package
        Returns: dict with interior_pdf and cover_pdf URLs
        """
        # Minimal implementation: generate interior PDF and return it.
        interior_pdf = await self.generate_pdf(project_id)
        return {"interior_pdf": interior_pdf, "cover_pdf": None}
