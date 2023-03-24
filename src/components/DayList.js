import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  // const DayListItemArray = [];

  // for (let i = 0; i < props.days.length; i++) {
  //   DayListItemArray.push(
  //     <DayListItem
  //       key={props.days[i].id}
  //       name={props.days[i].name}
  //       spots={props.days[i].spots}
  //       selected={props.days[i].name === props.day}
  //       setDay={props.setDay}
  //     ></DayListItem>
  //   );
  // }

  return (
    <ul>
      {props.days.map((day) => {
        return (
          <DayListItem
            key={day.id}
            name={day.name}
            spots={day.spots}
            selected={day.name === props.day}
            setDay={props.setDay}
          />
        );
      })}
    </ul>
  );
}
