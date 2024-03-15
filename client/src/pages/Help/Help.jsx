import PageHeader from "../../components/PageHeader";
import GoogleMap from "../../components/GoogleMap";
import { SiMinutemailer } from "react-icons/si";
import { useState } from "react";
import toast from "react-hot-toast";
import officeAddressImg from "../../assets/images/icon/01.png";
import whatsappImg from "../../assets/images/icon/05.png";
import emailImg from "../../assets/images/icon/03.png";
import websiteImg from "../../assets/images/icon/04.png";

export default function Help() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const subTitle = "Get in touch with us";
  const title = "We're Always Eager To Hear From You!";
  const conSubTitle = "Get in touch with us";
  const conTitle =
    "Fill The Form Below So We Can Get To Know You And Your Needs Better.";
  const btnText = "Send Message";

  const contactList = [
    {
      imgUrl: officeAddressImg,
      imgAlt: "contact icon",
      title: "Office Address",
      desc: "No 79, Mudaliyar Road, Akkaraipattu-4, SRILANKA",
    },
    {
      imgUrl: whatsappImg,
      imgAlt: "contact icon",
      title: "WhatsApp",
      desc: "+94 76 66 65 369",
      whatsapp: "94766665369",
    },
    {
      imgUrl: emailImg,
      imgAlt: "contact icon",
      title: "Send email",
      desc: "galleryglam.contact@gmail.com",
      email: "galleryglam.contact@gmail.com",
    },
    {
      imgUrl: websiteImg,
      imgAlt: "contact icon",
      title: "Our website",
      desc: "www.galleryglam.lk",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.name === "") {
      return toast.error("Please Enter Your Name!");
    }
    if (!formData.email || formData.email === "") {
      return toast.error("Please Enter Your Email!");
    }
    if (!formData.mobile || formData.mobile === "") {
      return toast.error("Please Enter Your Mobile Number!");
    }
    if (!formData.subject || formData.subject === "") {
      return toast.error("Please Enter The Subject!");
    }
    if (!formData.message || formData.message === "") {
      return toast.error("Please Enter Your Message!");
    }
    try {
      setLoading(true);
      const response = await fetch("/api/buyer/actions/contactAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setFormData({});
      toast.success(data);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div>
      {/* <PageHeader title={"Get In Touch With Us"} currentPage={"Contact Us"} /> */}
      <div
        className="map-address-section padding-tb section-bg"
        style={{ paddingTop: "100px" }}
      >
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">{subTitle}</span>
            <h2 className="title">{title}</h2>
          </div>
          <div className="section-wrapper">
            <div className="row flex-row-reverse">
              <div className="col-xl-4 col-lg-5 col-12">
                <div className="contact-wrapper">
                  {contactList.map((val, i) => (
                    <div key={i} className="contact-item">
                      <div className="contact-thumb">
                        <img src={val.imgUrl} alt="" />
                      </div>
                      <div className="contact-content">
                        <h6 className="title">{val.title}</h6>
                        {val.whatsapp ? (
                          <a
                            href={`https://wa.me/${val.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {val.desc}
                          </a>
                        ) : val.email ? (
                          <a href={`mailto:${val.email}`}>{val.desc}</a>
                        ) : (
                          <p>{val.desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* google map */}
              <div className="col-xl-8 col-lg-7 col-12">
                <GoogleMap />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-section padding-tb">
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">{conSubTitle}</span>
            <h2 className="title">{conTitle}</h2>
          </div>
          <div className="section-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name *"
                  onChange={handleChange}
                  value={formData.name || ""}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your Email *"
                  onChange={handleChange}
                  value={formData.email || ""}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="mobile"
                  id="mobile"
                  placeholder="Mobile Number *"
                  onChange={handleChange}
                  value={formData.mobile || ""}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder="Subject"
                  onChange={handleChange}
                  value={formData.subject || ""}
                  required
                />
              </div>
              <div className="form-group w-100">
                <textarea
                  name="message"
                  id="message"
                  rows="8"
                  placeholder="Your Message"
                  onChange={handleChange}
                  value={formData.message || ""}
                  required
                ></textarea>
              </div>
              <div className="form-group w-100 text-center">
                <button className="lab-btn" type="submit" disabled={loading}>
                  <span>
                    <SiMinutemailer /> &nbsp;
                    {btnText}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
