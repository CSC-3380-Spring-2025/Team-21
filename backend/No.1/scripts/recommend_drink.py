import pandas as pd
from fuzzywuzzy import process
import pickle
import fasttext
import numpy as np

#Load FastText model
fasttext_model = fasttext.load_model("models/fasttext_food_drink.model")

#Load KNN model
with open("models/knn_model.pkl", "rb") as f:
    knn_model = pickle.load(f)

#Load food-drink pair data
df = pd.read_csv("data/food_drink_pairs.csv")
food_names = df["FOOD"].tolist()
drink_dict = dict(zip(df["FOOD"], df["DRINK"]))

#Convert food items to FastText vectors for KNN
food_vectors = np.array([fasttext_model.get_word_vector(food) for food in df["FOOD"]])

def get_best_match(input_food, food_list):
    """Use fuzzy matching to find the closest food name."""
    best_match, score = process.extractOne(input_food, food_list)
    return best_match if score > 75 else None 

def recommend_drink(input_food):
    """Find the best drink pairing using fuzzy matching, KNN, and FastText."""
    #Fuzzy matching 
    matched_food = get_best_match(input_food, food_names)
    if matched_food:
        return f"Recommended drink for {matched_food}: {drink_dict[matched_food]}"
    
    #KNN model (finds closest food concept)
    input_vector = fasttext_model.get_word_vector(input_food)
    _, index = knn_model.kneighbors([input_vector])
    knn_food = df.iloc[index[0][0]]["Food"]
    if knn_food in drink_dict:
        return f"Recommended drink for {knn_food}: {drink_dict[knn_food]}"
    
    #FastText backup (if KNN fails)
    best_food = max(food_names, key=lambda food: fasttext_model.get_sentence_vector(food) @ input_vector)
    return f"Recommended drink for {best_food}: {drink_dict.get(best_food, 'No pairing found')}"

def main():
    print("Welcome! Enter 'exit' to quit." )
    while True:
        user_input = input("Enter a food item: ")

        if user_input.lower() == 'exit':
            print("Exiting program.")
            break

        print(recommend_drink(user_input))


if __name__ == "__main__":
   main()
