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
        console.log(prev[existingInventoryIndex]);
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

export {
  getFieldMessage,
  insertInventory,
  deleteInvetory,
  formatNumber,
  transformToPersianNumber,
};
