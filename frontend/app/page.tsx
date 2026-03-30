import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-[#140A82] mb-4">
            Livret de Suivi
          </h1>
          <p className="text-xl text-gray-600">
            Plateforme de suivi des alternants
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-[#140A82] mb-4">
              Accéder à un livret
            </h2>
            <p className="text-gray-600 mb-6">
              Le tuteur ou le référent doit utiliser le lien unique qui lui a été envoyé par email.
            </p>
            <p className="text-sm text-gray-500">
              Exemple : <code className="bg-gray-100 px-2 py-1 rounded">/livret/abc123-token-ici</code>
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Personnel administratif : Connectez-vous à l'interface Strapi pour créer et gérer les livrets<br />
            <a href="http://localhost:1337/admin" target="_blank" className="text-[#140A82] hover:underline">
              → Accéder à Strapi Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}