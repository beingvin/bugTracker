import React, { useEffect, useRef, useState } from "react";

import db from "./FirebaseConfig";
import {
  // getDocs,
  query,
  orderBy,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSquarePlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function BugTracker() {
  const [data, setData] = useState([]);
  const [updateBtn, setUpdateBtn] = useState(false);
  const collectionRef = collection(db, import.meta.env.VITE_collection_name);

  // input Refs
  const featureRef = useRef("");
  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const addedByRef = useRef("");
  const statusRef = useRef("");

  // bug States
  const [bug, setBug] = useState({
    id: "",
    feature: "",
    title: "",
    description: "",
    addedBy: "",
    status: "",
  });

  // get data from firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collectionRef, orderBy("date_time", "desc")),
      (snapshot) => {
        const bugsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(bugsData);
      }
    );

    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  // Add bug to firebase
  const handleAdd = async (e) => {
    e.preventDefault();

    const boolValue = bug.status === "true";
    await addDoc(collectionRef, {
      title: bug.title,
      feature: bug.feature,
      description: bug.description,
      status: boolValue,
      added_by: bug.addedBy,
      date_time: serverTimestamp(),
    });
    clearInputValues();
  };

  // update bug from firebase
  const handlEdit = (id) => {
    // const userDoc = doc(db, "bug_tracker", id);
    const currentBug = data.filter((bug) => bug.id === id);
    featureRef.current.value = currentBug[0].feature;
    titleRef.current.value = currentBug[0].title;
    descriptionRef.current.value = currentBug[0].description;
    addedByRef.current.value = currentBug[0].added_by;
    statusRef.current.value = currentBug[0].status;

    setBug({
      id: id,
      feature: currentBug[0].feature,
      title: currentBug[0].title,
      description: currentBug[0].description,
      addedBy: currentBug[0].added_by,
      status: currentBug[0].status,
    });
    setUpdateBtn(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const boolValue = bug.status === "true";
    const userDoc = doc(db, "bug_tracker", bug.id);
    await updateDoc(userDoc, {
      title: bug.title,
      feature: bug.feature,
      description: bug.description,
      status: boolValue,
      added_by: bug.addedBy,
      date_time: serverTimestamp(),
    });

    clearInputValues();

    setUpdateBtn(false);
  };

  // delete bug from firebase
  const handleDelete = (id) => {
    const userDoc = doc(db, "bug_tracker", id);
    deleteDoc(userDoc);
  };

  // clear inputs values
  const clearInputValues = () => {
    featureRef.current.value = "";
    titleRef.current.value = "";
    descriptionRef.current.value = "";
    addedByRef.current.value = "";
    statusRef.current.value = "DEFAULT";

    featureRef.current.focus();
  };

  return (
    <div>
      <div className="sectionTitle">
        <div className={style.quickLinks}>
          <h2 onClick={() => window.location.reload()}>Bug Tracker</h2>
        </div>
      </div>
      <div className={style.wrapper}>
        <div className={style.addBugForm}>
          <form autoComplete="off">
            <input
              type="text"
              name="feature"
              placeholder="feature.."
              ref={featureRef}
              onChange={(e) => setBug({ ...bug, feature: e.target.value })}
              className={style.input}
            />
            <input
              type="text"
              name="title"
              ref={titleRef}
              placeholder="add title.."
              onChange={(e) => setBug({ ...bug, title: e.target.value })}
              className={style.input}
            />
            <input
              type="text"
              name="description"
              ref={descriptionRef}
              placeholder="add description"
              onChange={(e) => setBug({ ...bug, description: e.target.value })}
              className={style.input}
            />
            <input
              type="text"
              name="addedBy"
              ref={addedByRef}
              placeholder="added by.."
              onChange={(e) => setBug({ ...bug, addedBy: e.target.value })}
              className={style.input}
            />
            <select
              name="status"
              ref={statusRef}
              defaultValue={"DEFAULT"}
              onChange={(e) => setBug({ ...bug, status: e.target.value })}
              className={style.select}
            >
              <option value="DEFAULT" disabled>
                status
              </option>
              <option value={true}>fixed</option>
              <option value={false}>pending</option>
            </select>
            <button
              className={style.button}
              type="submit"
              onClick={updateBtn ? handleUpdate : handleAdd}
            >
              {updateBtn ? "Update Bug" : "Add Bug"}
            </button>
          </form>
        </div>
        <div className={style.bugsTable}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>Feature </th>
                <th>Title </th>
                <th>Description</th>
                <th>Added By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((bug) => {
                return (
                  <tr key={bug.id} className={style.row}>
                    <td>{bug.feature}</td>
                    <td>{bug.title}</td>
                    <td style={{ width: "50%" }}>{bug.description}</td>
                    <td style={{ textAlign: "center" }}>{bug.added_by}</td>
                    <td style={{ textAlign: "center" }}>
                      {bug.status ? "Fixed" : "Pending"}
                    </td>
                    <td>
                      <div style={{ textAlign: "center" }}>
                        {" "}
                        <FontAwesomeIcon
                          icon={faSquarePlus}
                          onClick={clearInputValues}
                        />{" "}
                        &nbsp; &nbsp;
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          onClick={() => handlEdit(bug.id)}
                        />
                        &nbsp; &nbsp;
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => handleDelete(bug.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
