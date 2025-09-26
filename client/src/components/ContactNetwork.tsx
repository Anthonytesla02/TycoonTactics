import { useState } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { User, DollarSign, Heart, AlertTriangle } from "lucide-react";

export function ContactNetwork() {
  const { contacts, requestFavor, helpContact, player } = useGameState();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const selectedContactData = selectedContact 
    ? contacts.find(c => c.id === selectedContact)
    : null;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <Dialog key={contact.id}>
                <DialogTrigger asChild>
                  <div className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{contact.name}</div>
                        <div className="text-sm text-gray-400">{contact.role}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Net Worth:</span>
                        <span className="text-sm font-semibold">${contact.netWorth.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Loyalty:</span>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-400" />
                          <span className="text-sm">{contact.loyalty}/100</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={contact.relationship === 'ally' ? 'default' : 
                               contact.relationship === 'rival' ? 'destructive' : 'secondary'}>
                          {contact.relationship}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div>{contact.name}</div>
                        <div className="text-sm text-gray-400 font-normal">{contact.role}</div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Net Worth</div>
                        <div className="font-semibold">${contact.netWorth.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Loyalty</div>
                        <div className="font-semibold">{contact.loyalty}/100</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Influence</div>
                        <div className="font-semibold">{contact.influence}/100</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Relationship</div>
                        <Badge variant={contact.relationship === 'ally' ? 'default' : 
                               contact.relationship === 'rival' ? 'destructive' : 'secondary'}>
                          {contact.relationship}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Available Actions</div>
                      
                      {contact.currentProblem && (
                        <div className="p-3 bg-yellow-900/30 border border-yellow-600 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400">Needs Help</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{contact.currentProblem}</p>
                          <Button
                            size="sm"
                            onClick={() => helpContact(contact.id)}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Help (+{Math.floor(contact.influence / 10)} Loyalty)
                          </Button>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => requestFavor(contact.id, 'money')}
                          disabled={contact.loyalty < 50}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Request Loan
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => requestFavor(contact.id, 'info')}
                          disabled={contact.loyalty < 30}
                          variant="outline"
                        >
                          Ask for Tip
                        </Button>
                        
                        {contact.relationship === 'rival' && (
                          <Button
                            size="sm"
                            onClick={() => requestFavor(contact.id, 'sabotage')}
                            disabled={player.cash < 10000}
                            variant="destructive"
                          >
                            Sabotage ($10k)
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
