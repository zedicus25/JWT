import NavigationBar from './NavigationBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
function ThreeDPage() {
    return (
      <div>
        <NavigationBar></NavigationBar>
        <Container>
      <Row>
        <Col>1 of 2</Col>
        <Col>2 of 2</Col>
      </Row>
      <Row>
        <Col>1 of 3</Col>
        <Col>2 of 3</Col>
        <Col>3 of 3</Col>
      </Row>
    </Container>
      </div>
    );
  }
  
  export default ThreeDPage;