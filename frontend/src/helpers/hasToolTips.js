const hasToolTips = () => {
  if (!localStorage.hasOwnProperty('settings')) {
    return true;
  }
  const settings = JSON.parse(localStorage.getItem('settings'));
  if (!settings.hasOwnProperty('toolTips')) {
    return true;
  }
  return settings.toolTips;
};

export default hasToolTips;
