import mongoose from 'mongoose';

const FoodDetails = new mongoose.Schema({
  unit: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A food must have a name!'],
      trim: true,
    },
    details: {
      type: mongoose.model('FoodDetails', FoodDetails),
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Food', FoodSchema);
