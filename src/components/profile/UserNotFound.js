import Link from 'next/link';

export default function UserNotFound({ message }) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-6">{message || "The user you're looking for doesn't exist or may have been removed."}</p>
        <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
}