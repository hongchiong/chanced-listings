import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { logoMap } from './logos';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

function App() {
  const [listings, setListings] = useState({ data: []});

  useEffect(() => {
    const fetchListings = async () => {
      const result = await axios('https://api.chanced.co/v1/jobs');
      //change the links for logos
      for (let i = 0; i < result.data.data.length; i++) {
        result.data.data[i].company.logo = logoMap[result.data.data[i].company.logo];
        console.log(result.data.data[i].company.logo);
      }
      setListings(result.data);
    }

    fetchListings();
  }, []);

  let timer;
  const handleChange= (e) => {
    const fetchQueryListings = async () => {
      const result = await axios(`https://api.chanced.co/v1/jobs?query=${query}`);
      //change the links for logos
      for (let i = 0; i < result.data.data.length; i++) {
        result.data.data[i].company.logo = logoMap[result.data.data[i].company.logo];
        console.log(result.data.data[i].company.logo);
      }
      setListings(result.data);
    };

    const query = e.target.value;
    if (timer !== undefined) { clearTimeout(timer) }
    timer = setTimeout(fetchQueryListings, 300);
  };

  
  return (
    <div>
      <InputGroup className="my-3">
        <InputGroup.Prepend>
          <InputGroup.Text >Search Job</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Search by job title ..."
          onChange={handleChange}
        />
      </InputGroup>
      {
        listings.data.map(listing => (
          <Card key={listing.ID}>
            <Container>
              <Row>

                <Col md={2} className="d-flex align-items-center">
                  <Image className="logo" alt="company-logo" src={listing.company.logo} height="128" width="128" roundedCircle/>
                </Col>

                <Col md={6} className="d-flex align-items-center">
                  <Card.Body>
                    <div className="my-3 title">
                      {listing.title}
                    </div>
                    <div className="my-3">
                      <span className="companyname">{listing.company.name}</span> | <span className="country">{listing.country}</span>
                    </div>
                  </Card.Body>
                </Col>

                <Col md={4} className="d-flex align-items-center">
                  <Card.Body >
                    <div className="my-3 text-right">
                      <span><i className="fas fa-bookmark mr-2 ml-4"></i> Save </span> 
                      <span><i className="fas fa-share-alt mr-2 ml-4"></i> Share </span>
                    </div>
                    <div className="my-3 text-right"> 
                        {
                          (Date.now() - (new Date(listing.updated_at)).getTime()) > 60
                          ? <span>{Math.floor((Date.now() - (new Date(listing.updated_at)).getTime())/60000/60)} hours ago</span>
                          : <span>{(Date.now() - (new Date(listing.updated_at)).getTime())/60000} mins ago</span>
                        }
                    </div>
                  </Card.Body>
                </Col>

              </Row>
            </Container>
          </Card>
        ))
      }
    </div>
  );
}

export default App;