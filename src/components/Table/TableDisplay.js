import React from "react";
import "../../screens/HR/hr.styles.css";
import ReactPaginate from "react-paginate";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { CreateInititiveForm } from "../../screens/Appraisal/Initiative";

const TableDisplay = ({
  itemsPerPage,
  list,
  setList,
  perspective,
  loading,
}) => {
  const [initiative, setInitiative] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => setOpen(!open);

  const token = JSON.parse(localStorage.getItem("staffInfo")).token;
  const onDelete = (id) => {
    const check = window.confirm(`Are you sure you want to delete this item?`);
    if (check) {
      axios
        .delete(`${BASE_URL}/api/v1/initiative/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "access-token": token,
          },
        })
        .then((response) => {
          setList(list.filter((item) => item._id !== id));
        });
    }
  };

  const onEdit = (id) => {
    axios
      .get(`${BASE_URL}/api/v1/initiative/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      })
      .then((response) => {
        setInitiative(response.data.data);
        toggleOpen();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  function Items({ currentItems }) {
    return (
      <>
        {loading ? (
          <div>Fetching...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>PERSPECTIVE</th>
                <th>OBJECTIVES</th>
                <th>MEASURES</th>
                <th>TARGETS</th>
                <th>INITIATIVES</th>
                <th>SESSION</th>
                <th>DATE ADDED</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentItems && currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.perspective && item.perspective.title}</td>
                      <td>{item.objective}</td>
                      <td>{item.measures}</td>
                      <td>{item.target}</td>
                      <td>{item.initiative}</td>
                      <td>{item.session}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            onDelete(item._id);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                      <td>
                        <Button
                          colorScheme="green"
                          onClick={() => {
                            onEdit(item._id);
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colspan="8">You have not set any initiative!</td>
                </tr>
              )}
            </tbody>
            <CreateInititiveForm
              isOpen={open}
              onClose={toggleOpen}
              setList={setList}
              initiatives={initiative}
              edit={true}
            />
          </table>
        )}
      </>
    );
  }

  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = React.useState(null);
  const [pageCount, setPageCount] = React.useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = React.useState(0);

  React.useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + 5;
    setCurrentItems(list.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(list.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, list]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % list.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <div className={"paginate"}>
        <Items currentItems={currentItems} />
        <ReactPaginate
          nextLabel=" >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="<"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </>
  );
};

export default TableDisplay;
