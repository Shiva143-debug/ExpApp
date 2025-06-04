

const ImageContainer = () => {
  return (
    <div className="image-section">
      <h1 className="i-heading">Welcome to Expenditure Application </h1>
      <p className="i-para">An Expenditure Application is a software tool designed to track and manage expenses by recording transactions, categorizing spending, and generating reports. It helps users monitor financial outflows, manage budgets, and analyze spending patterns for better financial control.</p>
      <div style={{display:"flex"}}>
      <img src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1722424991/Screenshot_2024-07-31_165244_bewubg.png" alt="m-image" style={{width:"100px",marginRight:"10px"}}/>
      <p className="i-para">More people joined us, it's your turn.</p>
      </div>
    </div>
  );
};

export default ImageContainer;