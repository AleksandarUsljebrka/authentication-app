import React from "react";

const FilterDateComponent = ({ children, filterData, handleFilterChange }) => {
  return (
    <div className="flex justify-start gap-3">
      <label className="font-semibold text-sm text-gray-800 pt-2">
        Filter By Date Of Birth:
      </label>

      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <input
          type="date"
          name="startDate"
          max={filterData.endDate}
          value={filterData.startDate}
          onChange={(e) => handleFilterChange(e)}
          className="px-4 py-2 border rounded-lg text-sm"
          placeholder="Start Date"
        />
        <input
          type="date"
          min={filterData.startDate}
          name="endDate"
          value={filterData.endDate}
          onChange={(e) => handleFilterChange(e)}
          className="px-4 py-2 border rounded-lg text-sm"
          placeholder="End Date"
        />
      </div>
      {children}
    </div>
  );
};

export default FilterDateComponent;
