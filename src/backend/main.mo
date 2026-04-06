import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Nat "mo:core/Nat";

actor {
  type Answer = {
    questionId : Nat;
    choice : Nat;
  };

  type Question = {
    id : Nat;
    text : Text;
    options : [Text];
    correctAnswer : Nat;
  };

  public type Level = {
    id : Nat;
    name : Text;
    theme : Text;
    questions : [Question];
  };

  public type PlayerProgress = {
    player : Principal;
    displayName : Text;
    currentLevel : Nat;
    totalScore : Nat;
    streak : Nat;
    lastPlayed : Time.Time;
  };

  public type SubmissionResult = {
    correctAnswers : Nat;
    passed : Bool;
    newLevel : Nat;
    score : Nat;
    streak : Nat;
    totalScore : Nat;
  };

  type Player = {
    displayName : Text;
    currentLevel : Nat;
    totalScore : Nat;
    streak : Nat;
    lastPlayed : Time.Time;
    levelScores : Map.Map<Nat, Nat>;
  };

  public type LeaderboardEntry = {
    player : Principal;
    displayName : Text;
    totalScore : Nat;
  };

  module Player {
    public func compareByTotalScore(p1 : Player, p2 : Player) : Order.Order {
      Nat.compare(p2.totalScore, p1.totalScore);
    };
  };

  let levels = Map.empty<Nat, Level>();
  let players = Map.empty<Principal, Player>();

  func getOrCreatePlayer(caller : Principal) : Player {
    switch (players.get(caller)) {
      case (null) {
        let newPlayer : Player = {
          displayName = "Anonymous";
          currentLevel = 1;
          totalScore = 0;
          streak = 0;
          lastPlayed = 0;
          levelScores = Map.empty<Nat, Nat>();
        };
        players.add(caller, newPlayer);
        newPlayer;
      };
      case (?player) { player };
    };
  };

  func checkStreak(player : Player) : (Nat, Time.Time) {
    let currentTime = Time.now();
    let oneDayNs = 86_400_000_000_000;
    let daysSinceLastPlayed = if (player.lastPlayed == 0) {
      0;
    } else {
      (currentTime - player.lastPlayed) / oneDayNs;
    };

    if (daysSinceLastPlayed == 1) {
      (player.streak + 1, currentTime);
    } else if (daysSinceLastPlayed > 1) {
      (1, currentTime);
    } else {
      (player.streak, currentTime);
    };
  };

  public shared ({ caller }) func setDisplayName(name : Text) : async () {
    let player = getOrCreatePlayer(caller);
    let newPlayer = {
      player with
      displayName = name;
    };
    players.add(caller, newPlayer);
  };

  public query ({ caller }) func getLevel(levelId : Nat) : async Level {
    switch (levels.get(levelId)) {
      case (null) { Runtime.trap("Level not found") };
      case (?level) { level };
    };
  };

  public shared ({ caller }) func submitAnswers(levelId : Nat, answers : [Answer]) : async SubmissionResult {
    let player = getOrCreatePlayer(caller);

    if (levelId > player.currentLevel) {
      Runtime.trap("Level not unlocked yet");
    };

    let level = switch (levels.get(levelId)) {
      case (null) { Runtime.trap("Level not found") };
      case (?level) { level };
    };

    var correctAnswers = 0;
    for (question in level.questions.values()) {
      let answer = answers.find(func(a) { a.questionId == question.id });
      switch (answer) {
        case (null) {};
        case (?a) {
          if (a.choice == question.correctAnswer) {
            correctAnswers += 1;
          };
        };
      };
    };

    let passed = correctAnswers >= 3;
    let newLevel = if (passed and levelId == player.currentLevel and levelId < 5) { player.currentLevel + 1 } else {
      player.currentLevel;
    };
    let newScore = correctAnswers * 10;
    let totalScore = player.totalScore + newScore;

    let (newStreak, newLastPlayed) = checkStreak(player);

    let levelScores = player.levelScores.clone();
    levelScores.add(levelId, newScore);

    let newPlayer = {
      player with
      currentLevel = newLevel;
      totalScore;
      streak = newStreak;
      lastPlayed = newLastPlayed;
      levelScores;
    };
    players.add(caller, newPlayer);

    {
      correctAnswers;
      passed;
      newLevel;
      score = newScore;
      streak = newStreak;
      totalScore;
    };
  };

  public query ({ caller }) func getPlayerProgress(player : Principal) : async PlayerProgress {
    let overview = switch (players.get(player)) {
      case (null) { Runtime.trap("Player not found") };
      case (?playerData) {
        {
          player;
          displayName = playerData.displayName;
          currentLevel = playerData.currentLevel;
          totalScore = playerData.totalScore;
          streak = playerData.streak;
          lastPlayed = playerData.lastPlayed;
        };
      };
    };
    overview;
  };

  public shared ({ caller }) func resetLevel(levelId : Nat) : async () {
    let player = getOrCreatePlayer(caller);

    if (levelId > player.currentLevel) {
      Runtime.trap("Level not unlocked yet");
    };

    let levelScores = player.levelScores.clone();
    levelScores.add(levelId, 0);
    let newPlayer = {
      player with
      levelScores;
    };
    players.add(caller, newPlayer);
  };

  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    let entries = players.toArray().map(
      func((playerId, player)) {
        {
          player = playerId;
          displayName = player.displayName;
          totalScore = player.totalScore;
        };
      }
    );

    switch (entries.size()) {
      case (size) {
        entries.sort(
          func(a, b) { Nat.compare(b.totalScore, a.totalScore) }
        );
      };
    };
  };

  system func preupgrade() { () };

  system func postupgrade() {
    let level1Questions : [Question] = [
      {
        id = 1;
        text = "What is the largest continent by land area?";
        options = ["Asia", "Africa", "North America", "Europe"];
        correctAnswer = 0;
      },
      {
        id = 2;
        text = "Which animal is known as the 'King of the Jungle'?";
        options = ["Elephant", "Lion", "Tiger", "Giraffe"];
        correctAnswer = 1;
      },
      {
        id = 3;
        text = "Which is the largest ocean on Earth?";
        options = ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"];
        correctAnswer = 0;
      },
      {
        id = 4;
        text = "What is the process by which plants make their own food?";
        options = ["Photosynthesis", "Respiration", "Digestion", "Fermentation"];
        correctAnswer = 0;
      },
      {
        id = 5;
        text = "What is the tallest animal on Earth?";
        options = ["Giraffe", "Elephant", "Rhino", "Lion"];
        correctAnswer = 0;
      },
    ];

    let level2Questions : [Question] = [
      {
        id = 1;
        text = "Which ocean is the deepest?";
        options = ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"];
        correctAnswer = 0;
      },
      {
        id = 2;
        text = "What is the study of oceans called?";
        options = ["Oceanography", "Geology", "Meteorology", "Biology"];
        correctAnswer = 0;
      },
      {
        id = 3;
        text = "Which sea is known for its high salinity?";
        options = ["Dead Sea", "Red Sea", "Black Sea", "Baltic Sea"];
        correctAnswer = 0;
      },
      {
        id = 4;
        text = "What is the primary cause of ocean tides?";
        options = [
          "Moon's gravity",
          "Sun's heat",
          "Earth's rotation",
          "Wind patterns",
        ];
        correctAnswer = 0;
      },
      {
        id = 5;
        text = "What is the largest coral reef system?";
        options = [
          "Great Barrier Reef",
          "Red Sea Coral Reef",
          "Belize Barrier Reef",
          "Florida Reef",
        ];
        correctAnswer = 0;
      },
    ];

    let level3Questions : [Question] = [
      {
        id = 1;
        text = "What is the largest planet in our solar system?";
        options = ["Jupiter", "Saturn", "Earth", "Mars"];
        correctAnswer = 0;
      },
      {
        id = 2;
        text = "What is the closest star to Earth?";
        options = ["Sun", "Alpha Centauri", "Sirius", "Betelgeuse"];
        correctAnswer = 0;
      },
      {
        id = 3;
        text = "Which planet is known as the 'Red Planet'?";
        options = ["Mars", "Venus", "Mercury", "Jupiter"];
        correctAnswer = 0;
      },
      {
        id = 4;
        text = "Which planet has the most moons?";
        options = ["Jupiter", "Saturn", "Uranus", "Neptune"];
        correctAnswer = 0;
      },
      {
        id = 5;
        text = "What is the name of our galaxy?";
        options = [
          "Milky Way",
          "Andromeda",
          "Sombrero Galaxy",
          "Whirlpool Galaxy",
        ];
        correctAnswer = 0;
      },
    ];

    let level4Questions : [Question] = [
      {
        id = 1;
        text = "Who was the first President of the United States?";
        options = [
          "George Washington",
          "Abraham Lincoln",
          "Thomas Jefferson",
          "John Adams",
        ];
        correctAnswer = 0;
      },
      {
        id = 2;
        text = "What year did World War II end?";
        options = ["1945", "1940", "1950", "1939"];
        correctAnswer = 0;
      },
      {
        id = 3;
        text = "Who discovered America?";
        options = [
          "Christopher Columbus",
          "Leif Erikson",
          "Marco Polo",
          "Ferdinand Magellan",
        ];
        correctAnswer = 0;
      },
      {
        id = 4;
        text = "Which civilization built the pyramids?";
        options = [
          "Ancient Egyptians",
          "Romans",
          "Greeks",
          "Babylonians",
        ];
        correctAnswer = 0;
      },
      {
        id = 5;
        text = "Who was the famous queen of Ancient Egypt?";
        options = ["Cleopatra", "Nefertiti", "Hatshepsut", "Isis"];
        correctAnswer = 0;
      },
    ];

    let level5Questions : [Question] = [
      {
        id = 1;
        text = "What is the chemical symbol for Gold?";
        options = ["Au", "Ag", "Go", "Fe"];
        correctAnswer = 0;
      },
      {
        id = 2;
        text = "What is the powerhouse of the cell?";
        options = ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"];
        correctAnswer = 0;
      },
      {
        id = 3;
        text = "What is the formula for water?";
        options = ["H2O", "CO2", "O2", "H2SO4"];
        correctAnswer = 0;
      },
      {
        id = 4;
        text = "What is the boiling point of water at sea level?";
        options = [
          "100°C",
          "0°C",
          "50°C",
          "200°C",
        ];
        correctAnswer = 0;
      },
      {
        id = 5;
        text = "Which gas do plants absorb from the atmosphere?";
        options = [
          "Carbon Dioxide",
          "Oxygen",
          "Nitrogen",
          "Hydrogen",
        ];
        correctAnswer = 0;
      },
    ];

    let level1 : Level = {
      id = 1;
      name = "Level 1";
      theme = "Forest/Nature";
      questions = level1Questions;
    };
    let level2 : Level = {
      id = 2;
      name = "Level 2";
      theme = "Oceans";
      questions = level2Questions;
    };
    let level3 : Level = {
      id = 3;
      name = "Level 3";
      theme = "Space";
      questions = level3Questions;
    };
    let level4 : Level = {
      id = 4;
      name = "Level 4";
      theme = "History";
      questions = level4Questions;
    };
    let level5 : Level = {
      id = 5;
      name = "Level 5";
      theme = "Science";
      questions = level5Questions;
    };

    levels.add(1, level1);
    levels.add(2, level2);
    levels.add(3, level3);
    levels.add(4, level4);
    levels.add(5, level5);
  };
};
