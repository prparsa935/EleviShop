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
  const stock = form.current.inventoryStock.value;
  const size = form.current.inventorySize.value;
  if (stock && size) {
    const existingInventoryIndex = inventories.findIndex((inventory) => {
      if (inventory.size === size) {
        return true;
      }
    });

    if (existingInventoryIndex !== -1) {
      setInventories((prev) => {
        console.log(prev[existingInventoryIndex]);
        prev[existingInventoryIndex].stock = stock;
        return JSON.parse(JSON.stringify(prev));
      });
    } else {
      setInventories((prev) => {
        prev.push({ size: size, stock: stock });
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

export { getFieldMessage, insertInventory, deleteInvetory };