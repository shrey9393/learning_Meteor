import { Meteor } from "meteor/meteor";
import { LinksCollection } from "/imports/api/links";

Meteor.methods({
  "links.create": function ({ title, url }) {
    console.log("Creating link...", { title, url });
    try {
      const result = LinksCollection.insert({ title, url });
      console.log("Link created successfully:", result);
      return result;
    } catch (error) {
      console.error("Error creating link:", error);
      throw new Meteor.Error(
        "create-error",
        `Unable to create link: ${error.message}`
      );
    }
  },
  "links.update": function ({ _id, title, url }) {
    const $set = {};
    if (title !== undefined && title !== null) {
      $set.title = title;
    }
    if (url !== undefined && url !== null) {
      $set.url = url;
    }

    // Check if $set is not empty before performing the update
    if (Object.keys($set).length > 0) {
      return LinksCollection.update({ _id }, { $set });
    } else {
      // Nothing to update
      return 0;
    }
  },
  "links.delete": function ({ _id }) {
    return LinksCollection.remove({ _id });
  },
});
