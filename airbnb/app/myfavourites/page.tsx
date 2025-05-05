import PropertyList from "../components/properties/PropertyList";
import { getUserId } from "@/app/lib/action";
const MyFavouritesPage = async () => {
  const userId = await getUserId();
  if (!userId) {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <h1>You need to be Authenticated...</h1>
      </main>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-12">
      <h1 className="my-4 text-2xl">My Favourites</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PropertyList favourites={true} />
      </div>
    </main>
  );
};

export default MyFavouritesPage;
