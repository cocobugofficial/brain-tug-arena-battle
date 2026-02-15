interface ScoreBoardProps {
  player1Score: number;
  player2Score: number;
  player1Streak: number;
  player2Streak: number;
  player1Emoji: string;
  player2Emoji: string;
  ropePosition: number;
  isTournament: boolean;
  tournamentQuestionsLeft: number;
  coins: number;
}

export default function ScoreBoard({
  player1Score,
  player2Score,
  player1Streak,
  player2Streak,
  player1Emoji,
  player2Emoji,
  ropePosition,
  isTournament,
  tournamentQuestionsLeft,
  coins,
}: ScoreBoardProps) {
  return (
    <div className="flex items-center justify-between gap-2 w-full max-w-lg mx-auto">
      {/* Player 1 */}
      <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-2 shadow-cartoon">
        <span className="text-2xl">{player1Emoji}</span>
        <div className="text-left">
          <div className="font-display text-sm text-primary">P1</div>
          <div className="font-display text-lg text-foreground">{player1Score}</div>
          {player1Streak > 0 && (
            <div className="text-xs text-game-correct">🔥 {player1Streak}</div>
          )}
        </div>
      </div>

      {/* Center info */}
      <div className="text-center flex-1">
        <div className="font-display text-xs text-muted-foreground">
          {isTournament ? `🏆 ${tournamentQuestionsLeft} left` : 'Tug of War'}
        </div>
        <div className="flex items-center gap-1 justify-center">
          <span className="text-game-coin text-sm">🪙 {coins}</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-game-player1 to-game-player2 transition-all duration-500 rounded-full"
            style={{ width: `${ropePosition}%` }}
          />
        </div>
      </div>

      {/* Player 2 */}
      <div className="flex items-center gap-2 bg-destructive/10 rounded-xl px-3 py-2 shadow-cartoon">
        <div className="text-right">
          <div className="font-display text-sm text-destructive">P2</div>
          <div className="font-display text-lg text-foreground">{player2Score}</div>
          {player2Streak > 0 && (
            <div className="text-xs text-game-correct">🔥 {player2Streak}</div>
          )}
        </div>
        <span className="text-2xl">{player2Emoji}</span>
      </div>
    </div>
  );
}
