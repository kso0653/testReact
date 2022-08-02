export default {
    
  setFilterNullUndefined(list) {
    return list.filter((item) => {
        if (item != null && item !== undefined) return item;
    });
  }
    
};
