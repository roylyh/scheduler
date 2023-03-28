import { useState, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`),
    ]).then((all) => {
      console.log("all: ", all);
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  const setDay = (day) => setState({ ...state, day });
  const bookInterview = (id, interview) => {
    console.log("bookInterview, ", "id=", id, "interview=", interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        const days = state.days.map((obj) => {
          if (obj.appointments.includes(id)) {
            return {...obj, spots:(obj.spots - 1)}
          }
          return obj;
        })
        setState({ ...state, appointments, days });
      });
  };

  const cancelInterview = (id) => {
    console.log("cancelInterview, id=", id);
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        const days = state.days.map((obj) => {
          if (obj.appointments.includes(id)) {
            return {...obj, spots:(obj.spots + 1)}
          }
          return obj;
        })
        setState({ ...state, appointments,days });
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
