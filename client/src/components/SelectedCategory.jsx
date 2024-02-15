import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function SelectedCategory({ defaultCategory, onSelect }) {
  const [data, setData] = useState(undefined);
  const [selectedCategory, setSelectedCategory] = useState(
    defaultCategory || "all"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/category/getAllCategory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataFromResponse = await response.json();
        if (!response.ok) {
          console.log(response.message);
        }
        setData(dataFromResponse);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
    if (onSelect) {
      onSelect(selectedValue);
    }
  };

  return (
    <>
      {data && (
        <select value={selectedCategory} onChange={handleSelectChange}>
          <option value="all">All Category</option>
          {data.map((item) => (
            <option key={item._id} value={item._id}>
              {item.title}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
