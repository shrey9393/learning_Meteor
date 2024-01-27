import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { LinksCollection } from "../api/links";

export const Info = () => {
  const [formTarget, setFormTarget] = useState(null);
  const [error, setError] = useState(null);
  const links = useTracker(() => {
    return LinksCollection.find().fetch();
  });

  const onSubmitted = () => {
    setFormTarget(null);
    setError(null);
  };

  const onError = (err) => {
    if (err) {
      setError(err);
    } else {
      setError(null);
    }
  };

  const renderLinkForm = () => {
    return formTarget ? (
      <LinkForm
        onSubmitted={onSubmitted}
        onError={onError}
        doc={formTarget.doc}
        type={formTarget.type}
      />
    ) : null;
  };

  const renderError = () => {
    return error ? <div>{error.message}</div> : null;
  };

  const remove = (_id) => {
    Meteor.call("links.delete", { _id }, (err) => {
      if (err) {
        setError(err);
      } else {
        setError(null);
      }
    });
  };

  return (
    <div>
      <h2>Learn Meteor!</h2>
      <ul>
        {links.map((link) => (
          <li key={link._id}>
            <a href={link.url} target="_blank">
              {link.title}
            </a>
            <button
              onClick={() => setFormTarget({ type: "update", doc: link })}
            >
              Update
            </button>
            <button onClick={() => remove(link._id)}>Delete</button>
          </li>
        ))}
      </ul>
      {renderLinkForm()}
      {renderError()}
      <button onClick={() => setFormTarget({ type: "insert" })}>
        Create new
      </button>
    </div>
  );
};

const LinkForm = ({ type, doc, onSubmitted, onError }) => {
  const [title, setTitle] = useState(doc?.title ?? "");
  const [url, setUrl] = useState(doc?.url ?? "");

  const onSubmit = (e) => {
    e.preventDefault();
    if (type === "insert") {
      Meteor.call("links.create", { title, url }, (err, res) => {
        if (err) {
          onError(err);
        } else {
          onSubmitted(res);
        }
      });
    }
    if (type === "update") {
      Meteor.call("links.update", { _id: doc._id, title, url }, (err, res) => {
        if (err) {
          onError(err);
        } else {
          onSubmitted(res);
        }
      });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        <span>Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        <span>URL</span>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};
