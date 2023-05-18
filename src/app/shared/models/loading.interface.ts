interface ItemStatus {
  loading: boolean;
  error: boolean;
}

interface LoadingStatus {
  profile: ItemStatus;
  summary: ItemStatus;
  bancoDeHoras: ItemStatus;
  timeline: ItemStatus;
}

export {LoadingStatus, ItemStatus};
