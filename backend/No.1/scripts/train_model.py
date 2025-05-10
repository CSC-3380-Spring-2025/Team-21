import pandas as pd
import fasttext
import pickle
import numpy as np
from sklearn.neighbors import NearestNeighbors

# Load the food and drink pairings CSV
df = pd.read_csv('data/food_drink_pairs.csv')

# Prepare the data for FastText
def preprocess_for_fasttext(df):
    # Write the data in the format: `__label__drink food`
    with open("food_drink_training.txt", "w") as f:
        for index, row in df.iterrows():
            if pd.notna(row['FOOD']) and pd.notna(row['DRINK']):
                f.write(f"__label__{row['DRINK']} {row['FOOD']}\n")

# Preprocess the data and save it to a new file
preprocess_for_fasttext(df)

# Train the FastText model with supervised learning
fasttext_model = fasttext.train_supervised(
    input="food_drink_training.txt",
    lr=0.1,  # Learning rate
    epoch=25,  # Number of epochs (adjust if needed)
    wordNgrams=2,  # Word n-grams
    dim=50  # Dimensionality of word vectors (adjust if needed)
)

# Save the trained FastText model
fasttext_model.save_model("models/fasttext_food_drink.model")

# Vectorize each food item with FastText
food_vectors = np.array([fasttext_model.get_word_vector(food) for food in df["FOOD"]])
drink_vectors = np.array([fasttext_model.get_word_vector(drink) for drink in df["DRINK"]])

# Create a KNN model for food-drink pairing
knn_model = NearestNeighbors(n_neighbors=1, metric="cosine")
knn_model.fit(food_vectors)

# Save the KNN model
with open("models/knn_model.pkl", "wb") as f:
    pickle.dump(knn_model, f)

print("Training completed. Models saved.")
