import  { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import moment from "moment";
import {
  Button,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import "../NavBar/NavBar.css";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setQuery,
  setSource,
  fetchArticles,
  setFromDate,
  setToDate,
  setCategory,
} from "../../store/articles/articlesSlice";
import { sources, categories, capitaLize } from "../../config/config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logoImage from '../../assests/images/logo.jpg';


function NavBar() {
  const dispatch = useDispatch();
  
  const location = useLocation();

  const currentPath = location.pathname;

  const isPagePersonalized = /\/personalized/.test(currentPath);

  const [searchInputValue, setSearchInputValue] = useState("");

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState(sources[0]);

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState(""); 

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // const isSearchButtonDisabled = searchInputValue.trim() === "";
  console.log(selected);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setQuery(searchInputValue));
    dispatch(fetchArticles({ query: searchInputValue, source: selected.key, fromDate: startDate, toDate: endDate}));
    setSearchInputValue("");
  };

  const handleSelectSource = (eventKey) => {
    const selectedSource = sources.find((source) => source.key === eventKey);
    setSelected(selectedSource);
    dispatch(setSource(selectedSource));
  };

  const handleSelectCategory = (eventKey) => {
    const selectedCategory = categories.find(
      (category) => category === eventKey
    );
    setSelectedCategory(selectedCategory);
    dispatch(setCategory(selectedCategory));
  };

  const handleFromDateChange = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setStartDate(formattedDate);
    dispatch(setFromDate(formattedDate));
  };

  const handleToDateChange = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setEndDate(formattedDate);
    dispatch(setToDate(formattedDate));
  };

  useEffect(() => {
    dispatch(setSource(selected));
    dispatch(setFromDate(startDate));
    dispatch(setToDate(endDate));
    dispatch(setCategory(selectedCategory));
    dispatch(
      fetchArticles({
        query: searchInputValue,
        source: selected.key,
        category: selectedCategory,
        date: startDate,
        fromDate: startDate,
        toDate: endDate,
      })
    );
    dispatch(setQuery(''));
    // eslint-disable-next-line
  }, [dispatch, selected, selectedCategory]);

  return (
    <Navbar
      className="navbar"
      variant="dark"
      expand="lg"
      fixed="top"
      expanded={!isCollapsed}
    >
      <Navbar.Brand className="nav-brand" href="/">
        <img src={logoImage} alt="Logo" className="logo" />
      </Navbar.Brand>
      {isCollapsed && (
        <Navbar.Toggle
          className="border-0"
          aria-controls="basic-navbar-nav"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      )}

      {!isCollapsed && (
        <IoCloseOutline
          size={40}
          className="close-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      )}
      {isPagePersonalized ? (
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/personalized" className="active">
              Personalized News
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      ) : (
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="active">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/personalized">
              Personalized
            </Nav.Link>
            <NavDropdown
              id="dropdown-basic-button"
              title={capitaLize(selectedCategory)}
              onSelect={handleSelectCategory}
            >
              {categories.map((element, index) => (
                <NavDropdown.Item key={index} eventKey={element}>
                  {capitaLize(element)}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            <NavDropdown
              id="dropdown-basic-button"
              title={selected.name}
              onSelect={handleSelectSource}
            >
              {sources.map((element, index) => (
                <NavDropdown.Item key={index} eventKey={element.key}>
                  {element.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          <div className="date-picker">
            <DatePicker
              placeholderText={"From"}
              selected={startDate === "" ? null : startDate}
              onChange={handleFromDateChange}
              dateFormat={"dd-MM-YYYY"}
            />
          </div>
          <div className="date-picker">
            <DatePicker
              placeholderText={"To"}
              selected={endDate === "" ? null : endDate}
              onChange={handleToDateChange}
              dateFormat={"dd-MM-YYYY"}
            />
          </div>
          <Form className="search-form" onSubmit={handleSubmit} name="searchForm">
            <FormControl
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Explore news..."
              className="form-input color-white form-control-lg mt-lg-2 mt-md-2 mt-sm-2 mt-xl-0"
            />
            <Button
              onClick={handleSubmit}
              className="search-btn mt-lg-2 ml-2 mt-md-2 mt-sm-2 mt-xl-0"
              // disabled={isSearchButtonDisabled}
            >
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
}

export default NavBar;
