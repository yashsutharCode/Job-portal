import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />

      <RadioGroup className="mt-3 space-y-4">
        {filterData.map((data, i) => (
          <div key={i}>
            <h1 className="font-bold text-md mb-2">{data.filterType}</h1>

            {data.array.map((item, j) => {
              const id = `${data.filterType}-${item}`;

              return (
                <div key={j} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem
                    value={item}
                    id={id}
                    className="h-4 w-4 border border-gray-400"
                  />
                  <Label htmlFor={id} className="cursor-pointer">
                    {item}
                  </Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
