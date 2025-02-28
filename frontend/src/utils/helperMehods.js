const getFieldMessage = (fieldName, errors) => {
  if (errors) {
    for (const error of errors) {
      if (error.field === fieldName) {
        return error.message;
      }
    }
  }
  return null;
};

const insertInventory = (form, inventories, setInventories) => {
  const quantity = form.current.inventoryQuantity.value;
  const size = form.current.inventorySize.value;
  if (quantity && size) {
    const existingInventoryIndex = inventories.findIndex((inventory) => {
      if (inventory.size === size) {
        return true;
      }
    });

    if (existingInventoryIndex !== -1) {
      setInventories((prev) => {
        prev[existingInventoryIndex].quantity = quantity;
        return JSON.parse(JSON.stringify(prev));
      });
    } else {
      setInventories((prev) => {
        prev.push({ size: size, quantity: quantity });
        return JSON.parse(JSON.stringify(prev));
      });
    }
  }
};
const deleteInvetory = (size, inventories, setInventories) => {
  const existingInventoryIndex = inventories.findIndex((inventory) => {
    if (inventory.size === size) {
      return true;
    }
  });
  if (existingInventoryIndex !== -1) {
    setInventories((prev) => {
      prev.splice(existingInventoryIndex, 1);
      return JSON.parse(JSON.stringify(prev));
    });
  }
};
const formatNumber = (num) => {
  if (num) {
    const persianNumber = num?.toLocaleString("fa-IR");
    return persianNumber;
  }
};

function transformToPersianNumber(input) {
  if (input) {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return input
      .split("")
      .map((digit) => persianDigits[digit])
      .join("");
  }
}
function formatRelativeTime(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { max: 60, value: 1, name: "ثانیه" }, // Seconds
    { max: 3600, value: 60, name: "دقیقه" }, // Minutes
    { max: 86400, value: 3600, name: "ساعت" }, // Hours
    { max: 2592000, value: 86400, name: "روز" }, // Days
    { max: 31104000, value: 2592000, name: "ماه" }, // Months
    { max: Infinity, value: 31104000, name: "سال" }, // Years
  ];

  for (let unit of units) {
    if (diffInSeconds < unit.max) {
      const value = Math.floor(diffInSeconds / unit.value);
      return `${value} ${unit.name} پیش`;
    }
  }
}
export {
  getFieldMessage,
  insertInventory,
  deleteInvetory,
  formatNumber,
  transformToPersianNumber,
  formatRelativeTime
};
