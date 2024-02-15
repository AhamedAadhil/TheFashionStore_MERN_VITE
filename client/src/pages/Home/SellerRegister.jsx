const subtitle = "Save The Day";
const title = (
  <h2 className="title">
    Join on Day Long Free WorkShop for <b>Advance</b> <span>Mastering </span>on
    Sales
  </h2>
);
const desc = "Limited Time Offer! Hurry Up";

export default function SellerRegister() {
  return (
    <section className="register-section padding-tb pb-0">
      <div className="container">
        <div className="row g-4 row-cols-lg-2 row-cols-1 align-items-center">
          <div className="col">
            <div className="section-header">
              <span className="subtitle">{subtitle}</span>
              {title}
              <p>{desc}</p>
            </div>
          </div>
          <div className="col">
            <div className="section-wrapper">
              <h4>Register Now</h4>
              <form className="register-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Username"
                  className="reg-input"
                  required="true"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  className="reg-input"
                  required="true"
                />
                <input
                  type="number"
                  name="phone"
                  placeholder="+94"
                  className="reg-input"
                  required="true"
                />
                <button type="submit" className="lab-btn">
                  Register Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
