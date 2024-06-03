const isAppImage =
  process.env.SNAP_NAME === undefined &&
  process.env.FLATPAK_PATH === undefined &&
  process.env.APPIMAGE !== undefined &&
  process.env.APPIMAGE !== null;

export default isAppImage;
