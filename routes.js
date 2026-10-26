window.USAD_ROUTES = Object.freeze([
  Object.freeze({
    id: "malolos-trinoma",
    name: "Malolos to Trinoma",
    label: "Malolos to Trinoma via NLEX",
    origin: "Robinsons Place Malolos",
    originShort: "Malolos",
    destination: "Trinoma Landmark Bus Bay",
    destinationShort: "Trinoma",
    via: "North Luzon Expressway (NLEX)",
    demandFactors: [1, 0.98, 1.02, 1, 1.04, 1.08, 1.06, 1.1],
  }),
  Object.freeze({
    id: "trinoma-malolos",
    name: "Trinoma to Malolos",
    label: "Trinoma to Malolos via NLEX",
    origin: "Trinoma Landmark Bus Bay",
    originShort: "Trinoma",
    destination: "Robinsons Place Malolos",
    destinationShort: "Malolos",
    via: "North Luzon Expressway (NLEX)",
    demandFactors: [0.96, 1, 1.04, 1.08, 1.12, 1.1, 1.06, 1.02],
  }),
]);
