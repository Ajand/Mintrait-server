import mongoose from "mongoose";
const { Schema } = mongoose;

const TraitValueSchema = new Schema({
  value: String,
  amount: Number,
});

const TraitSchema = new Schema({
  name: String,
  variant: String,
  collectionId: mongoose.Types.ObjectId,
  values: [TraitValueSchema],
});

const Trait = mongoose.model("Trait", TraitSchema);

const createTrait = async (collectionId, { name, variant }) => {
  const trait = new Trait({ collectionId, name, variant, values: [] });
  return await trait.save();
};

const getCollectionTraits = async (collectionId) => {
  return await Trait.find({
    collectionId: new mongoose.Types.ObjectId(collectionId),
  });
};

export { createTrait, getCollectionTraits };
