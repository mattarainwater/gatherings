-- Magic Connections Puzzle Database Schema
-- Compatible with AWS DSQL (PostgreSQL)

-- Table to store puzzles
CREATE TABLE puzzles (
    id VARCHAR(255) PRIMARY KEY,
    publish_date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_puzzles_updated_at
    BEFORE UPDATE ON puzzles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table to store categories within each puzzle
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    puzzle_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(10) NOT NULL CHECK (color IN ('yellow', 'green', 'blue', 'purple')),
    difficulty INT NOT NULL,
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE
);

CREATE INDEX idx_categories_puzzle_id ON categories(puzzle_id);

-- Table to store cards within each category
CREATE TABLE cards (
    id VARCHAR(255) PRIMARY KEY,
    category_id VARCHAR(255) NOT NULL,
    scryfall_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE INDEX idx_cards_category_id ON cards(category_id);
