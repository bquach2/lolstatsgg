import React from "react";

export default function Addform(props) {
    return (
        <form onSubmit={props.getUsername}>
          <label>
            Name:
            <input type="text" name="name" />
          </label>
            <input type="submit" value="Submit" />
        </form>
    )
}