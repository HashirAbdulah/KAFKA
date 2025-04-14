import Image from "next/image";
import apiService from "../services/apiService";
import Link from "next/link";
const Reservations = async () => {
  const reservations = await apiService.get('/api/auth/myreservations/');

  console.log("Reservations data:", reservations); // For debugging

  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6 mt-4">
      <h1 className="my-4 text-2xl">My Reservations</h1>

      <div className="mt-4">
        {reservations && reservations.length > 0 ? (
          reservations.map((reservation: any) => (
            <div
              key={reservation.id}
              className="p-5 grid grid-col-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl mb-4"
            >
              <div className="col-span-1">
                <div className="relative overflow-hidden aspect-square rounded-xl">
                  <Image
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={reservation.property.image_url}
                    fill
                    className="hover:scale-110 object-cover transition h-full w-full"
                    alt={reservation.property.title}
                  />
                </div>
              </div>
              <div className="col-span-1 md:col-span-3">
                <h2 className="mb-4 text-2xl">{reservation.property.title}</h2>
                <p className="mb-2">
                  <strong>Check in date:</strong> {new Date(reservation.start_date).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <strong>Check out date:</strong> {new Date(reservation.end_date).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <strong>Number of Nights:</strong> {reservation.number_of_nights}
                </p>
                <p className="mb-2">
                  <strong>Total Price:</strong> ${reservation.total_price}
                </p>
                <Link
                href={`/properties/${reservation.property.id}`}
                className="mt-4 inline-block cursor-pointer py-4 px-6 bg-airbnb text-white rounded-xl transition-all ease-in-out hover:bg-airbnb-dark hover:scale-105">
                  Go to Properties
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-xl">You don't have any reservations yet.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Reservations;
