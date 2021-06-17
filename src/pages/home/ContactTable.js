import React from "react";
import Button from "react-bootstrap/Button";
import { Table } from "react-bootstrap";

function ContactTable(props) {


  return (
    <Table responsive="sm" size="md" hover bordered>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Avatar</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.data.length > 0 ? (
          props.data.map((elm, idx) => {
            return (
              <tr key={idx}>
                <td>{`${elm.firstName || ""} ${elm.lastName}`}</td>
                <td>{elm.age}</td>
                <td>
                  <img
                    src={elm.photo}
                    alt="avatar"
                    style={{ height: "50px", width: "50px", borderRadius: 100 }}
                  />
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    onClick={() => {props.handleEdit(elm)}}
                    size="sm"
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="outline-danger"
                    onClick={() => {props.handleDelete(elm)}}
                    size="sm"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4}>No contacts...</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default ContactTable;
