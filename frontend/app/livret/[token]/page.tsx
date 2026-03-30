'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Printer, Save, Building2 } from 'lucide-react';

type FormData = {
  entreprise: {
    designation: string;
    adresse: string;
    tuteurNom: string;
    tuteurFonction: string;
    tuteurTelephone: string;
    tuteurEmail: string;
  };
};

export default function LivretPage({ params }: { params: { token: string } }) {
  const [livret, setLivret] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, setValue } = useForm<FormData>();

  useEffect(() => {
    fetchLivret();
  }, [params.token]);

  const fetchLivret = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/livrets?filters[tokenAcces][$eq]=${params.token}&populate=deep`
      );

      const result = await res.json();
      if (result.data && result.data.length > 0) {
        const livretData = result.data[0];
        setLivret(livretData);

        if (livretData.attributes.entreprise) {
          setValue('entreprise', livretData.attributes.entreprise);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement du livret", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!livret) return;
    setSaving(true);
    setSuccessMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/livrets/${livret.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            entreprise: data.entreprise,
          },
        }),
      });

      if (res.ok) {
        setSuccessMessage('✅ Informations de l\'entreprise sauvegardées avec succès !');
      } else {
        setSuccessMessage('❌ Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setSuccessMessage('❌ Erreur de connexion au serveur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-bleu-cobalt">Chargement du livret...</div>;
  }

  if (!livret) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Livret non trouvé ou lien invalide.</div>;
  }

  const { etudiant, suiviCompetences = [], bilansIntermediaires = [] } = livret.attributes;
  const etudiantData = etudiant?.data?.attributes || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none">

        {/* Header */}
        <header className="bg-[#140A82] text-white p-10 print:p-8">
          <div className="flex justify-between">
            <div>
              <h1 className="text-4xl font-bold">LIVRET DE SUIVI EN ALTERNANCE</h1>
              <p className="text-2xl mt-4">
                {etudiantData.prenom} {etudiantData.nom}
              </p>
            </div>
            <div className="text-right text-sm">
              <p>Promotion {etudiantData.formation?.data?.attributes?.annee}</p>
              <p className="mt-1">CFA - Alternance</p>
            </div>
          </div>
        </header>

        <div className="p-10 print:p-8 space-y-14">

          {/* Identification Apprenti */}
          <section>
            <h2 className="text-2xl font-semibold text-[#140A82] mb-6">1. IDENTIFICATION DE L'APPRENTI</h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <p><strong>Nom :</strong> {etudiantData.nom}</p>
              <p><strong>Prénom :</strong> {etudiantData.prenom}</p>
              <p><strong>Email :</strong> {etudiantData.email}</p>
              <p><strong>Téléphone :</strong> {etudiantData.telephone || '-'}</p>
              <p><strong>Formation :</strong> {etudiantData.formation?.data?.attributes?.nom}</p>
            </div>
          </section>

          {/* Entreprise - Formulaire */}
          <section className="border-2 border-[#EB6023] rounded-2xl p-8 bg-orange-50">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="text-[#EB6023]" size={28} />
              <h2 className="text-2xl font-semibold text-[#EB6023]">2. ENTREPRISE D'ACCUEIL</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Dénomination de l'entreprise</label>
                  <input {...register('entreprise.designation')} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <input {...register('entreprise.adresse')} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du tuteur</label>
                  <input {...register('entreprise.tuteurNom')} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fonction</label>
                  <input {...register('entreprise.tuteurFonction')} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone tuteur</label>
                  <input {...register('entreprise.tuteurTelephone')} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email tuteur</label>
                  <input type="email" {...register('entreprise.tuteurEmail')} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#EB6023] hover:bg-[#d14f1c] text-white px-8 py-4 rounded-xl font-medium transition"
                >
                  <Save size={20} />
                  {saving ? 'Sauvegarde...' : 'Enregistrer'}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 border border-[#140A82] text-[#140A82] hover:bg-[#140A82] hover:text-white px-8 py-4 rounded-xl font-medium transition"
                >
                  <Printer size={20} />
                  Imprimer / PDF
                </button>
              </div>
            </form>
          </section>

          {/* Suivi des compétences */}
          <section>
            <h2 className="text-2xl font-semibold text-[#140A82] mb-6">3. SUIVI DES COMPÉTENCES</h2>
            {suiviCompetences.length > 0 ? (
              <div className="space-y-6">
                {suiviCompetences.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 border-[#24A444] pl-6 py-4 bg-white rounded-r-xl">
                    <h3 className="font-medium">{item.competence}</h3>
                    <p className="text-sm text-gray-600 mt-1">Niveau : <span className="font-semibold">{item.niveauAtteint}</span></p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucune compétence renseignée pour le moment.</p>
            )}
          </section>

          {/* Message de succès */}
          {successMessage && (
            <div className="p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}