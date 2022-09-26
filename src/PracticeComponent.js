import { Component } from "react";
import PropTypes from "prop-types";
class PracticeComponent extends Component {
  render() {
    const { name, age, phone, address } = this.props;
    return (
      <div>
        이름:{name} <br />
        나이:{age} <br />
        전화번호:010{phone} <br />
        주소:{address} <br />
      </div>
    );
  }
}

PracticeComponent.defaultProps = {
  name: "이름을 입력하세요",
  age: 0,
  phone: 0,
  주소: "주소를 입력하세요",
};

PracticeComponent.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  phone: PropTypes.number,
  address: PropTypes.string,
};

export default PracticeComponent;
