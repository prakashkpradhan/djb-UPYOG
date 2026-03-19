const { drivers, socketDriverMap } = require("../store/driver.store");

function getAllDrivers() {
  return Array.from(drivers.values());
}

function markDriverOnline(driverId, socketId) {
  const existing = drivers.get(driverId) || {};

  const updatedDriver = {
    driverId,
    lat: existing.lat ?? null,
    lng: existing.lng ?? null,
    accuracy: existing.accuracy ?? 0,
    altitude: existing.altitude ?? 0,
    heading: existing.heading ?? 0,
    speed: existing.speed ?? 0,
    speedAccuracy: existing.speedAccuracy ?? 0,
    timestamp: existing.timestamp ?? new Date().toISOString(),
    isFinal: false,
    isOnline: true,
    lastSeen: new Date().toISOString(),
    socketId,
    deliveryLat: existing.deliveryLat ?? null,
    deliveryLng: existing.deliveryLng ?? null,
  };

  drivers.set(driverId, updatedDriver);
  socketDriverMap.set(socketId, driverId);

  return updatedDriver;
}

function updateDriverLocation(socketId, data) {
  const driverId = String(data.driverId || socketDriverMap.get(socketId) || "").trim();

  if (!driverId) {
    throw new Error("driverId is required in driver-location");
  }

  const lat = Number(data.lat);
  const lng = Number(data.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Valid lat and lng are required");
  }

  const updatedDriver = {
    driverId,
    lat,
    lng,
    accuracy: Number(data.accuracy || 0),
    altitude: Number(data.altitude || 0),
    heading: Number(data.heading || 0),
    speed: Number(data.speed || 0),
    speedAccuracy: Number(data.speedAccuracy || 0),
    timestamp: data.timestamp || new Date().toISOString(),
    isFinal: Boolean(data.isFinal),
    isOnline: true,
    lastSeen: new Date().toISOString(),
    socketId,
    deliveryLat: data.deliveryLat != null ? Number(data.deliveryLat) : null,
    deliveryLng: data.deliveryLng != null ? Number(data.deliveryLng) : null,
  };

  drivers.set(driverId, updatedDriver);
  socketDriverMap.set(socketId, driverId);

  return updatedDriver;
}

function markDriverOffline(driverId, timestamp) {
  const existing = drivers.get(driverId);
  if (!existing) return null;

  const updatedDriver = {
    ...existing,
    isOnline: false,
    timestamp: timestamp || new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  };

  drivers.set(driverId, updatedDriver);
  return updatedDriver;
}

function handleSocketDisconnect(socketId) {
  const driverId = socketDriverMap.get(socketId);
  if (!driverId) return null;

  const existing = drivers.get(driverId);
  if (!existing) {
    socketDriverMap.delete(socketId);
    return null;
  }

  const updatedDriver = {
    ...existing,
    isOnline: false,
    lastSeen: new Date().toISOString(),
  };

  drivers.set(driverId, updatedDriver);
  socketDriverMap.delete(socketId);

  return updatedDriver;
}

function getDriverIdFromSocket(socketId) {
  return socketDriverMap.get(socketId);
}

module.exports = {
  getAllDrivers,
  markDriverOnline,
  updateDriverLocation,
  markDriverOffline,
  handleSocketDisconnect,
  getDriverIdFromSocket,
};