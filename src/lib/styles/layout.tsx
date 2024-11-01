export const styles = {
  parent: {
    display: "grid",
    gridTemplateColumns: "0.6fr repeat(3, 1fr) 0.85fr",
    gridTemplateRows: "0.06fr repeat(3, 1fr) 0.06fr",
    gridColumnGap: 0,
    gridRowGap: 0,
  },
  header: {
    gridArea: "1 / 1 / 2 / 6",
  },
  leftPanel: {
    gridArea: "2 / 1 / 4 / 2",
  },
  bottomPanel: {
    gridArea: "4 / 1 / 5 / 5",
  },
  rightPanel: {
    gridArea: "2 / 5 / 5 / 6",
  },
  centerPanel: {
    gridArea: "2 / 2 / 4 / 5",
  },
  footer: {
    gridArea: "5 / 1 / 6 / 6",
  },
};
