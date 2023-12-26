import React, { Component } from "react";
import axios, { Axios } from "axios";
import { useEffect, useReducer, useState } from "react";
import $ from "jquery";
import "jquery-ui-dist/jquery-ui";
import "./Todo.css";
import "bootstrap/dist/css/bootstrap.css";

function Todo() {
  const [data, setData] = useState([]);

  const [title, setTitle] = useState("");

  const [modal, setmodal] = useState(true);

  const [task, updatedtask] = useState("");


  const addPassword = () => {
    axios.post("http://localhost:8000/addtask", {
      Name: title,
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/gettask")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const deleteUser = async (id, e) => {
    var a = window.confirm("do you want to delete?");
    if (a) {
      e.preventDefault();
      axios.delete(`http://localhost:8000/deletetask/${id}`);

      alert("task has been deleted");
    } else {
      alert("task is not deleted");
    }
  };

  useEffect(() => {
    $(".update").click(function () {
      $(".updatesection").css("display", "block");
    });

    $(".updaten").click(function () {
      $(".updatesection").css("display", "none");
    });
  });

  const [currentPage, setCurrentPage] = useState(1);
  const recordPerPage = 5;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  return (
    <div>
      <div className="input">
        <input
          type="text"
          placeholder="Enter your task"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <button className="submit" onClick={addPassword}>
          {" "}
          Submit
        </button>
      </div>
      <div className="updatesection">
        <input type="text" />
        <button className="updaten">Update now</button>
      </div>
      {records.map((item, index) => {
        return (
          <div className="main" key={index}>
            <div className="list">
              <p>{item.id}</p>
              <p className="task">{item.Name}</p>
              <button className="update">Update</button>
              <button
                className="delete"
                onClick={(e) => deleteUser(item.id, e)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}

      <nav>
        <ul className="pagination">
          <li className="page-item">
            <a href="#" onClick={prePage} className="page-link">
              Prev
            </a>
          </li>

          {numbers.map((n, i) => (
            <li
              className={`page-item ${currentPage === n ? 'active' : ''}`}
              key={i}
            >
              <a href="#" onClick={() =>changeCPage(n)} className="page-link">
                {n}
              </a>
            </li>
          ))}

          <li className="page-item">
            <a href="#" onClick={nextPage} className="page-link">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );

  function prePage(){
    if(currentPage !== firstIndex){
      setCurrentPage(currentPage-1)
    }
  }

  function changeCPage(id){
    setCurrentPage(id)
  }

  function nextPage(){
    if(currentPage !== lastIndex){
      setCurrentPage(currentPage+1)
    }

  }
}

export default Todo;
