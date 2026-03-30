'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LivretPublic({ params }: { params: { token: string } }) {
  const [livret, setLivret] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    fetchLivret();
  }, [params.token]);

  const fetchLivret = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/livrets?filters[tokenAcces][$eq]=${params.token}&populate=deep`
      );
      const { data } = await res.json();
      if (data && data.length > 0) {
        setLivret(data[0]);
        // Pré-remplir le formulaire entreprise
        if (data[0].attributes.entreprise) {
          Object.entries(data[0].attributes.entreprise).forEach(([key, value]) => {
            setValue(`entreprise.${key}`, value);
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!livret) return;
    setSaving(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/livrets/${livret.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { entreprise: data.entreprise } }),
      });
      alert("Sauvegardé avec succès !");
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Chargement du livret...</div>;
  if (!livret) return <div className="text-center py-20 text-red-600">Livret non trouvé ou lien invalide</div>;

  const { etudiant, entreprise, suiviCompetences = [], bilansIntermediaires = [] } = livret.attributes;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-6">

        {/* En-tête */}
        <div className="text-center mb-12 border-b pb-8">
          <h1 className="text-4xl font-bold text-bleu-cobalt">LIVRET DE SUIVI EN ALTERNANCE</h1>
          <p className="text-2xl mt-4 text-gray-700">
            {etudiant?.data?.attributes?.prenom} {etudiant?.data?.attributes?.nom}
          </p>
        </div>

        {/* Partie Entreprise - Editable par le tuteur */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <section className="border border-orange p-8 rounded-2xl bg-orange/5">
            <h2 className="text-2xl font-semibold text-orange mb-6">2. ENTREPRISE D'ACCUEIL</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Dénomination</label>
                <input {...register('entreprise.designation')} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Adresse</label>
                <input {...register('entreprise.adresse')} className="w-full border rounded-lg p-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du tuteur</label>
                <input {...register('entreprise.tuteurNom')} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fonction</label>
                <input {...register('entreprise.tuteurFonction')} className="w-full border rounded-lg p-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-8 bg-orange text-white px-10 py-4 rounded-xl font-medium hover:bg-orange/90"
            >
              {saving ? "Sauvegarde..." : "Enregistrer les informations entreprise"}
            </button>
          </section>
        </form>

        {/* Autres sections (lecture seule pour l'instant) */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-bleu-cobalt mb-6">Suivi des Compétences</h2>
          {suiviCompetences.map((item: any, i: number) => (
            <div key={i} className="mb-6 p-6 border rounded-xl">
              <p className="font-medium">{item.competence}</p>
              <p className="text-sm text-gray-600 mt-2">Niveau : {item.niveauAtteint}</p>
            </div>
          ))}
        </section>

        <div className="mt-12 flex gap-4 justify-center">
          <button 
            onClick={() => window.print()}
            className="bg-bleu-cobalt text-white px-10 py-4 rounded-xl font-medium"
          >
            Générer PDF
          </button>
        </div>
      </div>
    </div>
  );
}