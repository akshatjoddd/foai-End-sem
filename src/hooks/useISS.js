import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { calculateSpeed } from '../utils/haversine';
import toast from 'react-hot-toast';

export function useISS() {
  const [positions, setPositions] = useState([]);
  const [currentPos, setCurrentPos] = useState(null);
  const [speed, setSpeed] = useState(27600);
  const [nearestPlace, setNearestPlace] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [people, setPeople] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(true);

  const prevPosRef = useRef(null);

  const fetchISSPosition = useCallback(async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      setError(null);
      const res = await axios.get('https://api.allorigins.win/raw?url=http://api.open-notify.org/iss-now.json');
      const { latitude, longitude } = res.data.iss_position;
      const timestamp = res.data.timestamp;
      const timeLabel = new Date(timestamp * 1000).toLocaleTimeString();

      const newPos = { latitude: parseFloat(latitude), longitude: parseFloat(longitude), timestamp, timeLabel };

      let currentSpeed = 27600;
      if (prevPosRef.current) {
        const timeDiff = timestamp - prevPosRef.current.timestamp;
        currentSpeed = calculateSpeed(prevPosRef.current, newPos, timeDiff);
      }
      setSpeed(currentSpeed);

      setSpeedHistory(prev => {
        const newHist = [...prev, { time: timeLabel, speed: currentSpeed }];
        return newHist.slice(-240);
      });

      setCurrentPos(newPos);
      prevPosRef.current = newPos;

      setPositions(prev => {
        const newArr = [...prev, newPos];
        return newArr.slice(-240);
      });

      // Fetch nearest place
      try {
        const nomRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
          headers: { 'Accept-Language': 'en' }
        });
        if (nomRes.data && nomRes.data.display_name) {
          const parts = nomRes.data.display_name.split(',').map(s => s.trim());
          const place = parts.slice(-2).join(', ');
          setNearestPlace(place || "Over ocean / remote area");
        } else {
          setNearestPlace("Over ocean / remote area");
        }
      } catch (e) {
        setNearestPlace("Over ocean / remote area");
      }

      if (isManual) {
        toast.success("ISS position refreshed!");
      }
    } catch (err) {
      setError("Failed to fetch ISS position.");
      if (isManual) toast.error("Failed to refresh ISS position.");
    } finally {
      if (isManual) setLoading(false);
      setLoading(false);
    }
  }, []);

  const fetchPeople = async () => {
    try {
      setPeopleLoading(true);
      const res = await axios.get('https://api.allorigins.win/raw?url=http://api.open-notify.org/astros.json');
      setPeople(res.data.people || []);
    } catch (err) {
      console.error(err);
    } finally {
      setPeopleLoading(false);
    }
  };

  useEffect(() => {
    fetchISSPosition();
    fetchPeople();
  }, [fetchISSPosition]);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchISSPosition();
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchISSPosition]);

  const manualRefresh = () => fetchISSPosition(true);
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => {
      const newVal = !prev;
      if (newVal) toast.success("Auto-refresh enabled");
      else toast.success("Auto-refresh disabled");
      return newVal;
    });
  };

  return {
    positions, currentPos, speed, nearestPlace, loading, error,
    autoRefresh, speedHistory, people, peopleLoading,
    manualRefresh, toggleAutoRefresh
  };
}
