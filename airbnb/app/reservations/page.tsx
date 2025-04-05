import Image from "next/image";
const Reservations = () => {
  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6 mt-4">
      <h1 className="my-4 text-2xl">My Reservations</h1>
      {/* Reservtion div */}
      <div className="mt-4">
        <div className="p-5 grid grid-col-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl">
          <div className="col-span-1">
            <div className="relative overflow-hidden aspect-square rounded-xl">
              <Image
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={"/beach_img.jpg"}
                fill
                className="hover:scale-110 object-cover transition h-full w-full"
                alt="beach house"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h2 className="mb-4 text-2xl">Property Name</h2>
            <p className="mb-2">
              <strong>Check in date:</strong> 09/03/2025
            </p>
            <p className="mb-2">
              <strong>Check out date:</strong> 09/03/2025
            </p>
            <p className="mb-2">
              <strong>Number of Nights:</strong> 2
            </p>
            <p className="mb-2">
              <strong>Total Price:</strong> $83
            </p>

            <div className="mt-4 inline-block cursor-pointer py-4 px-6 bg-airbnb text-white rounded-xl transition-all ease-in-out hover:bg-airbnb-dark hover:scale-105">
              Go to Properties
            </div>
          </div>
        </div>
      </div>
      {/* Reservation div */}
      <div className="mt-4">
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl">
          <div className="col-span-1">
            <div className="relative overflow-hidden aspect-square rounded-xl">
              <Image
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={"/beach_img.jpg"}
                fill
                className="hover:scale-110 object-cover transition h-full w-full"
                alt="beach house"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h2 className="mb-4 text-2xl">Property Name</h2>
            <p className="mb-2">
              <strong>Check in date:</strong> 09/03/2025
            </p>
            <p className="mb-2">
              <strong>Check out date:</strong> 09/03/2025
            </p>
            <p className="mb-2">
              <strong>Number of Nights:</strong> 2
            </p>
            <p className="mb-2">
              <strong>Total Price:</strong> $83
            </p>

            <div className="mt-4 inline-block cursor-pointer py-4 px-6 bg-airbnb text-white rounded-xl transition-all ease-in-out hover:bg-airbnb-dark hover:scale-105">
              Go to Properties
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reservations;
