import Categories from "./components/Categories";
import PropertyList from "./components/properties/PropertyList";

export default function Home() {
  return (
    <main className="max-w-[1650px] mx-auto px-6">
      <Categories />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PropertyList />
      </div>
    </main>
  );
}
