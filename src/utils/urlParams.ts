const getSearchParams = (): URLSearchParams => {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.search);
};

export const getCompanyNameFromUrl = (): string => {
  return getSearchParams().get('companyName')?.trim() || '';
};

export const getTicketingCoFromUrl = (): string => {
  return getSearchParams().get('ticketingco')?.trim() || '';
};
