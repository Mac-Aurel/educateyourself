// Raw response shapes from external APIs before normalization

export type AcledEvent = {
  event_id_cnty: string;
  event_date: string;
  country: string;
  event_type: string;
  fatalities: number;
  notes: string;
};

export type AcledResponse = {
  status: number;
  data: AcledEvent[];
  count: number;
};

export type ReliefWebReport = {
  id: number;
  fields: {
    title: string;
    body: string;
    date: { created: string };
    country: { name: string; iso3: string }[];
    source: { name: string; homepage: string }[];
    url: string;
  };
};

export type ReliefWebResponse = {
  data: ReliefWebReport[];
  count: number;
  total: number;
};

export type UnhcrStatEntry = {
  year: number;
  coo_name: string;
  coa_name: string;
  refugees: number;
  asylum_seekers: number;
  idps: number;
  stateless: number;
};

export type UnhcrResponse = {
  items: UnhcrStatEntry[];
};
