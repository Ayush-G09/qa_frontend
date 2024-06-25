export const generateTheme = (mode: string) => ({
  colors: {
      font100: mode === 'light' ? '#000000' : '#FFFFFF', 
      base100: mode === 'light' ? '#F7F8F9' : '#1D2125',
      base200: mode === 'light' ? '#F1F2F4' : '#22262B',
      base300: mode === 'light' ? '#DCDFE4' : '#2C333A',
      base400: mode === 'light' ? '#B3B9C4' : '#454F59',
      blue100: '#4CC9F0',
      blue200: '#3F66DA',
      blue300: '#2336C4',
      blue400: '#0504AA',
      blue500: '#031273',
      gray300: mode === 'light' ? '#B3B9C4' : '#596773',
      gray400: mode === 'light' ? '#8590A2' : '#454F59',

  },
  fonts: {
      body: 'Arial, sans-serif',
      heading: 'Roboto, sans-serif',
  },
  fontSize: {
      small: '1rem',
      medium: '2rem',
      large: '3rem'
  },
  fontWeight: {
      small: 400,
      medium: 500,
      large: 600
  },
  shadows: {
    shadow105: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
    shadowHover57: '0px 0px 5px 0px rgba(0, 0, 0, 0.7)',
    shadowInset: mode === "light" ? "rgba(0, 0, 0, 0.2)" : "rgba(225, 225, 225, 0.2)",
  }
});
