import { motion } from 'framer-motion';
import { PlayerStats, MatchRecord } from '@/hooks/useLeaderboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LeaderboardProps {
  stats: PlayerStats;
  onBack: () => void;
  onClear: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function modeLabel(m: MatchRecord) {
  if (m.mode === 'tournament') return '🏆 Tournament';
  if (m.mode === 'ai') return `🤖 vs AI (${m.aiDifficulty ?? '?'})`;
  return '👥 2P';
}

function resultBadge(m: MatchRecord) {
  if (m.winner === 1) return <span className="text-primary font-display">WIN</span>;
  if (m.winner === 2) return <span className="text-destructive font-display">LOSS</span>;
  return <span className="text-muted-foreground font-display">DRAW</span>;
}

export default function Leaderboard({ stats, onBack, onClear }: LeaderboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="font-display text-sm text-muted-foreground hover:text-foreground transition">
          ← Back
        </button>
        <h2 className="font-display text-3xl text-foreground text-stroke">📊 Leaderboard</h2>
        <div className="w-12" />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard emoji="🎮" label="Games" value={stats.totalGames} />
        <StatCard emoji="🏅" label="Wins" value={stats.wins} sub={`${stats.winRate}%`} />
        <StatCard emoji="🪙" label="Coins Earned" value={stats.totalCoinsEarned} />
        <StatCard emoji="✅" label="Correct Answers" value={stats.totalCorrectAnswers} />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-2xl p-4 shadow-cartoon">
          <h3 className="font-display text-lg text-foreground mb-2">🏆 Tournament</h3>
          <div className="space-y-1 font-body text-sm text-muted-foreground">
            <p>Games: <span className="text-foreground font-display">{stats.tournamentGames}</span></p>
            <p>Wins: <span className="text-foreground font-display">{stats.tournamentWins}</span></p>
            <p>Best Score: <span className="text-foreground font-display">{stats.tournamentBestScore}</span></p>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-cartoon">
          <h3 className="font-display text-lg text-foreground mb-2">🤖 vs AI</h3>
          <div className="space-y-1 font-body text-sm text-muted-foreground">
            <p>Games: <span className="text-foreground font-display">{stats.aiGames}</span></p>
            <p>Wins: <span className="text-foreground font-display">{stats.aiWins}</span></p>
            <p>Win Rate: <span className="text-foreground font-display">
              {stats.aiGames > 0 ? Math.round((stats.aiWins / stats.aiGames) * 100) : 0}%
            </span></p>
          </div>
        </div>
      </div>

      {/* Win/Loss bar */}
      {stats.totalGames > 0 && (
        <div className="mb-6">
          <p className="font-display text-sm text-muted-foreground mb-2">Performance</p>
          <div className="flex h-4 rounded-full overflow-hidden shadow-cartoon">
            {stats.wins > 0 && (
              <div className="bg-primary transition-all" style={{ width: `${(stats.wins / stats.totalGames) * 100}%` }} />
            )}
            {stats.draws > 0 && (
              <div className="bg-muted transition-all" style={{ width: `${(stats.draws / stats.totalGames) * 100}%` }} />
            )}
            {stats.losses > 0 && (
              <div className="bg-destructive transition-all" style={{ width: `${(stats.losses / stats.totalGames) * 100}%` }} />
            )}
          </div>
          <div className="flex justify-between mt-1 font-body text-xs text-muted-foreground">
            <span className="text-primary">{stats.wins}W</span>
            <span>{stats.draws}D</span>
            <span className="text-destructive">{stats.losses}L</span>
          </div>
        </div>
      )}

      {/* Match History */}
      <div className="mb-4">
        <h3 className="font-display text-lg text-foreground mb-3">📜 Recent Matches</h3>
        {stats.recentMatches.length === 0 ? (
          <p className="text-muted-foreground font-body text-sm text-center py-8">No matches played yet. Go play!</p>
        ) : (
          <div className="bg-card rounded-2xl shadow-cartoon overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-display text-xs">Date</TableHead>
                  <TableHead className="font-display text-xs">Mode</TableHead>
                  <TableHead className="font-display text-xs">Score</TableHead>
                  <TableHead className="font-display text-xs">Coins</TableHead>
                  <TableHead className="font-display text-xs text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentMatches.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="font-body text-xs text-muted-foreground">{formatDate(m.date)}</TableCell>
                    <TableCell className="font-body text-xs">{modeLabel(m)}</TableCell>
                    <TableCell className="font-display text-sm">{m.player1Score} - {m.player2Score}</TableCell>
                    <TableCell className="font-body text-xs text-game-coin">🪙 {m.coinsEarned}</TableCell>
                    <TableCell className="text-right text-sm">{resultBadge(m)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {stats.recentMatches.length > 0 && (
        <button onClick={onClear}
          className="w-full py-2 rounded-xl font-display text-sm text-destructive bg-destructive/10 hover:bg-destructive/20 transition">
          🗑️ Clear History
        </button>
      )}
    </motion.div>
  );
}

function StatCard({ emoji, label, value, sub }: { emoji: string; label: string; value: number; sub?: string }) {
  return (
    <div className="bg-card rounded-2xl p-3 shadow-cartoon text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="font-display text-xl text-foreground">{value}</div>
      <div className="font-body text-xs text-muted-foreground">
        {label} {sub && <span className="text-primary">({sub})</span>}
      </div>
    </div>
  );
}
