"""
Amazon KDP specifications and utilities
"""

# KDP Trim Sizes (width x height in inches)
KDP_TRIM_SIZES = {
    "5x8": (5, 8),
    "5.25x8": (5.25, 8),
    "5.5x8.5": (5.5, 8.5),
    "6x9": (6, 9),
    "6.14x9.21": (6.14, 9.21),  # A5
    "6.69x9.61": (6.69, 9.61),  # US Trade
    "7x10": (7, 10),
    "7.5x9.25": (7.5, 9.25),
    "8x10": (8, 10),
    "8.25x11": (8.25, 11),
    "8.5x11": (8.5, 11),  # US Letter
}

# KDP Binding Types
KDP_BINDING_TYPES = ["paperback", "hardcover"]

# KDP Paper Types
KDP_PAPER_TYPES = ["white", "cream"]

# KDP Ink Types
KDP_INK_TYPES = ["black_white", "premium_color", "standard_color"]

# Minimum margins (inches)
KDP_MARGINS = {
    "paperback": {
        "top": 0.375,
        "bottom": 0.375,
        "outer": 0.375,
        "inner_base": 0.375,  # + gutter based on page count
    }
}


def calculate_spine_width(
    page_count: int, paper_type: str = "white", ink_type: str = "black_white"
) -> float:
    """
    Calculate spine width for KDP based on page count and paper type

    Args:
        page_count: Total number of pages
        paper_type: "white" or "cream"
        ink_type: "black_white", "premium_color", or "standard_color"

    Returns:
        Spine width in inches
    """
    # Pages Per Inch (PPI) for different paper types
    ppi = {
        ("white", "black_white"): 442,
        ("white", "premium_color"): 444,
        ("white", "standard_color"): 444,
        ("cream", "black_white"): 392,
    }

    key = (paper_type, ink_type)
    pages_per_inch = ppi.get(key, 442)

    return page_count / pages_per_inch


def calculate_gutter(page_count: int) -> float:
    """
    Calculate gutter (inner margin addition) based on page count

    Args:
        page_count: Total number of pages

    Returns:
        Additional gutter width in inches
    """
    if page_count <= 150:
        return 0.0
    elif page_count <= 300:
        return 0.0625  # 1/16 inch
    elif page_count <= 500:
        return 0.125  # 1/8 inch
    elif page_count <= 700:
        return 0.1875  # 3/16 inch
    else:
        return 0.25  # 1/4 inch
