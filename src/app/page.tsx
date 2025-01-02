import { WalletConnect } from '@/components/wallet-connect';
// import { CreatePoll } from '@/components/create-poll';
// import { ActivePolls } from '@/components/active-polls';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Privacy-First Voting System
          </h1>
          <p className="text-muted-foreground">
            Powered by Calimero Network & StarkNet
          </p>
        </header>

        <div className="grid gap-8">
          <section className="bg-card rounded-lg p-6 shadow-xl">
            <WalletConnect />
          </section>

          <section className="bg-card rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
              Create New Poll
            </h2>
            {/* <CreatePoll /> */}
          </section>

          <section className="bg-card rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
              Active Polls
            </h2>
            {/* <ActivePolls /> */}
          </section>
        </div>
      </div>
    </main>
  );
}
