export default function GoogleMap() {
  return (
    <div className="map-area">
      <div className="maps">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d247.37915844310774!2d81.85198419864628!3d7.233251780285227!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slk!4v1711526790647!5m2!1sen!2slk"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
