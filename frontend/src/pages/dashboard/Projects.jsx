import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/ui/Button";
import { Plus, BookOpen, Calendar, Star } from "lucide-react";

export default function Projects() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-orient-dark mb-2">
              Mes Projets
            </h1>
            <p className="text-gray-500 text-lg">
              Créez et gérez vos histoires magiques
            </p>
          </div>
          <Button onClick={() => navigate("/create/new")}>
            <Plus className="w-5 h-5 mr-2" />
            Nouveau projet
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-orient-cloud/30 p-8 rounded-full mb-6">
          <BookOpen className="w-20 h-20 text-orient-purple" />
        </div>
        <h2 className="text-2xl font-display font-bold text-orient-dark mb-3">
          Aucun projet pour le moment
        </h2>
        <p className="text-gray-600 text-center max-w-md mb-8">
          Commencez votre première histoire magique en créant un nouveau projet.
          L'IA vous accompagnera à chaque étape !
        </p>
        <Button
          onClick={() => navigate("/create/new")}
          size="lg"
          className="bg-gradient-to-r from-orient-purple to-orient-blue"
        >
          <Plus className="w-5 h-5 mr-2" />
          Créer mon premier projet
        </Button>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="bg-orient-sky/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-orient-blue" />
            </div>
            <h3 className="font-bold text-orient-dark mb-2">IA Créative</h3>
            <p className="text-sm text-gray-600">
              Générez du contenu unique adapté à votre style
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="bg-orient-cloud/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-orient-purple" />
            </div>
            <h3 className="font-bold text-orient-dark mb-2">
              Chapitres illimités
            </h3>
            <p className="text-sm text-gray-600">
              Organisez votre histoire en chapitres structurés
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="bg-orient-sand/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-orient-gold" />
            </div>
            <h3 className="font-bold text-orient-dark mb-2">
              Suivi de progression
            </h3>
            <p className="text-sm text-gray-600">
              Suivez l'avancement de chaque projet facilement
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
